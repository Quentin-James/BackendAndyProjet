import { Injectable } from '@nestjs/common';

@Injectable()
export class BetCalculationService {
  /**
   * Calcule le gain potentiel total (mise + profit)
   * @param amount Montant misé
   * @param odds Cote du pari
   * @returns Gain potentiel total
   */
  calculatePotentialWin(amount: number, odds: number): number {
    return Math.round(amount * odds * 100) / 100;
  }

  /**
   * Calcule le profit net (gain - mise)
   * @param amount Montant misé
   * @param odds Cote du pari
   * @returns Profit net
   */
  calculateProfit(amount: number, odds: number): number {
    const potentialWin = this.calculatePotentialWin(amount, odds);
    return Math.round((potentialWin - amount) * 100) / 100;
  }

  /**
   * Calcule la probabilité implicite d'une cote
   * @param odds Cote du pari
   * @returns Probabilité en pourcentage
   */
  calculateImpliedProbability(odds: number): number {
    return Math.round((1 / odds) * 100 * 100) / 100;
  }

  /**
   * Calcule les cotes pour un pari combiné (accumulator)
   * @param odds Array de cotes
   * @returns Cote totale
   */
  calculateAccumulatorOdds(odds: number[]): number {
    const totalOdds = odds.reduce((acc, odd) => acc * odd, 1);
    return Math.round(totalOdds * 100) / 100;
  }

  /**
   * Vérifie si une cote est valide
   * @param odds Cote à vérifier
   * @returns true si valide
   */
  isValidOdds(odds: number): boolean {
    return odds >= 1.01 && odds <= 100;
  }

  /**
   * Calcule le montant à miser pour gagner un montant spécifique
   * @param targetWin Montant souhaité à gagner
   * @param odds Cote du pari
   * @returns Montant à miser
   */
  calculateStakeForTargetWin(targetWin: number, odds: number): number {
    return Math.round((targetWin / odds) * 100) / 100;
  }

  /**
   * Calcule le retour sur investissement (ROI)
   * @param totalStaked Montant total misé
   * @param totalReturned Montant total récupéré
   * @returns ROI en pourcentage
   */
  calculateROI(totalStaked: number, totalReturned: number): number {
    if (totalStaked === 0) return 0;
    const roi = ((totalReturned - totalStaked) / totalStaked) * 100;
    return Math.round(roi * 100) / 100;
  }
}
