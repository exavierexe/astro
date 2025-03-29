# Minimal Swiss Ephemeris Files

This directory contains the minimal set of Swiss Ephemeris files required for birth chart calculations in the application.

## Contents

- `swetest`: Swiss Ephemeris command-line tool
- `libswe.so`: Swiss Ephemeris shared library
- `seleapsec.txt`: Leap seconds data
- `ephe/`: Directory containing ephemeris data files
  - `sefstars.txt`: Fixed stars data
  - `seorbel.txt`: Orbital elements data
  - Planetary data files for the period 1800-2100:
    - `seas_*.se1`: Asteroids
    - `semo_*.se1`: Moon
    - `sepl_*.se1`: Planets

## Size Optimization

These files are a minimal subset of the full Swiss Ephemeris library, containing only what's needed for standard birth chart calculations covering dates from 1800 to 2100.

## License

Swiss Ephemeris is licensed under the AGPL license. See the LICENSE.txt file for details.

## Source

These files are derived from the full Swiss Ephemeris package, which can be found at:
https://github.com/aloistr/swisseph

For more information about the Swiss Ephemeris project, visit:
https://www.astro.com/swisseph/
