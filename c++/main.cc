/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Main file for the DecisionMethod program
 */

#include "src/headers/tools.h"
#include "src/headers/decisionmethod.h"
#include "src/headers/pessimistic.h"
#include "src/headers/optimistic.h"
#include "src/headers/laplace.h"
#include "src/headers/hurwitz.h"
#include <string>
#include <iostream>
 
int main() {
  const std::string fname = "how_to_expand.csv";
  std::vector<Alternative*> table = ParseTable(fname);
  // Print parsed table for debugging
  std::cout << "Parsed alternatives:" << std::endl;
  for (const auto* alt : table) {
    std::cout << alt->name << ": (" << alt->outcomes.first << ", " << alt->outcomes.second << ")" << std::endl;
  }
  DecisionMethod* method = new Pessimistic();

  

  std::cout << "Pessimistic: ";
  {
    std::pair<std::string, double> result = method->Execute(table);
    std::cout << result.first << "(" << result.second << ")" << std::endl;
    delete method;
  }

  std::cout << "Optimistic: ";
  {
    method = new Optimistic();
    std::pair<std::string, double> result = method->Execute(table);
    std::cout << result.first << "(" << result.second << ")" << std::endl;
    delete method;
  }

  std::cout << "Laplace: ";
  {
    method = new Laplace();
    std::pair<std::string, double> result = method->Execute(table);
    std::cout << result.first << "(" << result.second << ")" << std::endl;
    delete method;
  }

  std::cout << "Hurwitz:  " << std::endl ;
  {
    method = new Hurwitz();
    method->Execute(table);
  }

  for (auto* alt : table) delete alt;
  return 0;
}
