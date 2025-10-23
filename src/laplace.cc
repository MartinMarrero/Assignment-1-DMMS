/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Implementation file for the Laplace class
 */

#include "./headers/laplace.h"

std::pair<std::string, double> Laplace::Execute(std::vector<Alternative*> table) {
  Alternative* best_alternative = new Alternative;
  double best_mean = -1;
  for (auto& alternative : table) {
    double alternative_mean = (alternative->outcomes.first + alternative->outcomes.second) / 2;
    if (alternative_mean > best_mean) { best_alternative = alternative; best_mean = alternative_mean; }
  }
  return std::make_pair(best_alternative->name, best_mean);
}