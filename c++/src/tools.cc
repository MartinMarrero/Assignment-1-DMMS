/**
 * University of Maribor
 * Faculty of Electrical Engineering and Computer Science
 * Degree in Computer Science and Informatics 
 * Decision Making Models and Systems
 * Assingment 1
 * @author Martín José Marrero Quintans
 * @since 23/10/2025
 * @brief Auxiliary file that contains various functions
 */

#include <fstream>
#include <vector> 
#include <sstream>
#include <string>
#include <algorithm>
#include <cctype>
#include <cmath>
#include <iomanip>
#include "./headers/tools.h"

/**
 * @brief Function that parses a .csv file to read the outcome table
 * @param [in] filename: the name of the file to parse
 * @returns a map that contains the name of the alternative as the key and the two outcomes as a pair as the value
 */


std::vector<Alternative*> ParseTable(const std::string& filename) {
    std::vector<Alternative*> table;

    std::ifstream in(filename);
    if (!in.is_open()) return table;
    std::string line;
    auto trim = [](std::string &s) {
        while (!s.empty() && std::isspace(static_cast<unsigned char>(s.front()))) s.erase(s.begin());
        while (!s.empty() && std::isspace(static_cast<unsigned char>(s.back()))) s.pop_back();
    };
	// Read header (first line) to get alternative names
	if (!std::getline(in, line)) return table;
	std::vector<std::string> headerCells;
	{
		std::stringstream ss(line);
		std::string cell;
		while (std::getline(ss, cell, ',')) {
			trim(cell);
			headerCells.push_back(cell);
		}
	}
	if (headerCells.size() < 2) return table;
	for (size_t i = 1; i < headerCells.size(); ++i) {
		Alternative* alt = new Alternative();
		alt->name = headerCells[i];
		alt->outcomes = {0.0, 0.0};
		table.push_back(alt);
	}
	int rowIndex = 0;
	while (std::getline(in, line)) {
		if (line.empty()) continue;
		std::vector<std::string> cells;
		std::stringstream ss(line);
		std::string cell;
		while (std::getline(ss, cell, ',')) {
			trim(cell);
			cells.push_back(cell);
		}
		if (cells.size() < 2) continue; // must have at least outcome name + one value
		for (size_t i = 1; i < cells.size() && i <= table.size(); ++i) {
			double val = 0.0;
			try {
				val = static_cast<double>(std::stoi(cells[i]));
			} catch (...) {
				val = 0.0;
			}
			if (rowIndex == 0) {
				table[i - 1]->outcomes.first = val;
			} else if (rowIndex == 1) {
				table[i - 1]->outcomes.second = val;
			}
			// If there are more than two outcome rows, they are ignored because the
			// return type only holds two values per alternative.
		}
		++rowIndex;
	}
	return table;
}

std::string FormatDouble(double value) {
	// Treat values very close to an integer as integers
	double intpart;
	double frac = std::modf(value, &intpart);
	const double eps = 1e-9;
	std::ostringstream oss;
	if (std::fabs(frac) < eps) {
		oss << std::fixed << std::setprecision(1) << value;
	} else {
		// Use default formatting for non-integer values
		oss << value;
	}
	return oss.str();
}