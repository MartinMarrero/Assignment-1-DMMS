/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Implementation file for the Hurwitz class
 */

#include <thread>
#include <chrono>
#include "./headers/hurwitz.h"

std::pair<std::string, double> Hurwitz::Execute(std::vector<Alternative*> table) {
  std::cout << "h   | status quo | expansion | building HQ | collaboration " << std::endl;
  std::cout << "----------------------------------------------------------" << std::endl;
  for (double optimism_degree = 0; optimism_degree < 1; optimism_degree += 0.1) {
    double status_quo = optimism_degree * (table[0]->outcomes.second) + (1-optimism_degree)*(table[0]->outcomes.first);
    double expansiom = optimism_degree * (table[1]->outcomes.second) + (1-optimism_degree)*(table[1]->outcomes.first);
    double building_hq = optimism_degree * (table[2]->outcomes.second) + (1-optimism_degree)*(table[2]->outcomes.first);
    double collaboration = optimism_degree * (table[3]->outcomes.second) + (1-optimism_degree)*(table[3]->outcomes.first);
    std::cout << FormatDouble(optimism_degree) << " | " << FormatDouble(status_quo) << "       | " << FormatDouble(expansiom) << "      | " << FormatDouble(building_hq) << "        | " << FormatDouble(collaboration) << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
  }

  return std::make_pair("jeje", 67.67);
}