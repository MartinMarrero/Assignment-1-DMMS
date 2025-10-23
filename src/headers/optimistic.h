/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Header file for the Optimistic class
 */

#include "decisionmethod.h"
#include "tools.h"

class Optimistic : public DecisionMethod {
 public:
  std::pair<std::string, double> Execute(std::vector<Alternative*> table) override;
};