#ifndef TOOLS_H
#define TOOLS_H

#include <string>
#include <utility>
#include <vector>

struct Alternative {
  std::string name;
  std::pair<double, double> outcomes;
};

// ParseTable reads a CSV file and returns a vector of pointers to Alternative,
// each containing the alternative name and a pair of outcome values (as doubles).
// Ownership: the caller is responsible for deleting the returned Alternative*.
std::vector<Alternative*> ParseTable(const std::string& filename);

// FormatDouble returns a string for the given double where integer-valued
// numbers are formatted with one decimal place (e.g., 3 -> "3.0").
// Non-integer values are returned using the default stream representation.
std::string FormatDouble(double value);

#endif // TOOLS_H
