import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/user.entities';
import { AuthToken } from '../entities/auth_tokens.entities';
import { randomBytes } from 'crypto';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    if (!event.entity) return;

    try {
      const refresh = randomBytes(48).toString('hex');
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Première tentative : insertion via QueryBuilder (si mapping fonctionne)
      try {
        await event.manager
          .createQueryBuilder()
          .insert()
          .into(AuthToken)
          .values({
            user_id: event.entity.id,
            refresh_token: refresh,
            expires_at: expires,
          } as Partial<AuthToken>)
          .execute();
      } catch {
        // fallback silencieux vers requête SQL directe (utile si le mapping TS entité <> table pose problème)
        try {
          // Postgres parameter placeholders ($1...) — adapté à votre DB (si MySQL => use ? placeholders)
          const sql =
            'INSERT INTO auth_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)';
          // use ISO string for timestamp param to be safe
          await event.manager.query(sql, [event.entity.id, refresh, expires.toISOString()]);
        } catch {
          // silent fallback failure: ne bloque pas la création de l'utilisateur
        }
      }
    } catch {
      // global silent catch (n'empêche pas la création de l'utilisateur)
    }
  }
}
