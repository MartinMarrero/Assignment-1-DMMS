/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Implementation file for the Pessimistic class
 */

#include "./headers/pessimistic.h"

std::pair<std::string, double> Pessimistic::Execute(std::vector<Alternative*> table) {
  Alternative* best_alternative = new Alternative;
  best_alternative->outcomes.first= -1;
  for (auto& alternative : table) {
    if (alternative->outcomes.first > best_alternative->outcomes.first) { best_alternative = alternative; }
  }
  return std::make_pair(best_alternative->name, best_alternative->outcomes.first);
}