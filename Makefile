# Makefile for Assignment-1-DMMS
# Builds the `test` binary from sources in src/ and main.cc

CXX := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -I src/headers
SRCS := $(wildcard src/*.cc)
MAIN := main.cc
TARGET := test

.PHONY: all run clean help

all: $(TARGET)

$(TARGET): $(SRCS) $(MAIN)
	$(CXX) $(CXXFLAGS) $(SRCS) $(MAIN) -o $(TARGET)

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET) $(SRCS:.cc=.o)

help:
	@echo "Makefile targets:"
	@echo "  make       - build $(TARGET) (default)"
	@echo "  make run   - run the built binary" 
	@echo "  make clean - remove binary and object files"
