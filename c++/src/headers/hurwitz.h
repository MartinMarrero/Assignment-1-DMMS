/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Header file for the Hurwitz class
 */

#include "decisionmethod.h"
#include "tools.h"
#include <iostream>

class Hurwitz : public DecisionMethod {
 public:
  std::pair<std::string, double> Execute(std::vector<Alternative*> table) override;
};