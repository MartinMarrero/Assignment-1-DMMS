/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Implementation file for the Savage (Minimax Regret) class
 */

#include <limits>
#include <algorithm>
#include <iostream>
#include "./headers/savage.h"

std::pair<std::string, double> Savage::Execute(std::vector<Alternative*> table) {
  if (table.empty()) return std::make_pair(std::string(""), 0.0);

  double max_state0 = -std::numeric_limits<double>::infinity();
  double max_state1 = -std::numeric_limits<double>::infinity();
  for (const auto& alt : table) {
    if (alt->outcomes.first > max_state0) max_state0 = alt->outcomes.first;
    if (alt->outcomes.second > max_state1) max_state1 = alt->outcomes.second;
  }

  // Compute regrets per alternative and pick the alternative with minimum of
  // the maximum regrets (minimax regret)
  Alternative* best_alt = table[0];
  double best_max_regret = std::numeric_limits<double>::infinity();

  std::cout << "Regret matrix (alternative: (state0, state1))" << std::endl;
  for (const auto& alt : table) {
    double r0 = max_state0 - alt->outcomes.first;
    double r1 = max_state1 - alt->outcomes.second;
    double max_regret = std::max(r0, r1);
    std::cout << alt->name << ": (" << FormatDouble(r0) << ", " << FormatDouble(r1) << ")" << std::endl;
    if (max_regret < best_max_regret) {
      best_max_regret = max_regret;
      best_alt = alt;
    }
  }

  return std::make_pair(best_alt->name, best_max_regret);
}
