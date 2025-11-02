/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Header file for the DecisionMethod class
 */

#ifndef DECISIONMETHOD_H
#define DECISIONMETHOD_H

#include <vector>
#include <string>

// Forward declaration to avoid requiring tools.h here and to prevent
// circular-include issues when headers include each other.
struct Alternative;

class DecisionMethod {
 public:
  DecisionMethod() = default;
  virtual ~DecisionMethod();
  virtual std::pair<std::string, double> Execute(std::vector<Alternative*> table) = 0;
};

#endif // DECISIONMETHOD_H