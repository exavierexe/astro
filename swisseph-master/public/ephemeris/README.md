# Minimal Swiss Ephemeris Files

This directory contains a minimal set of files from the Swiss Ephemeris package
that are sufficient for basic astrological calculations. The full package can be
found at https://www.astro.com/swisseph/.

These files are used for calculating planetary positions and astronomical data
in the application. In serverless environments, the application will fall back
to simplified calculations.

## Files Included

- swetest: The Swiss Ephemeris command-line calculator
- libswe.so: The Swiss Ephemeris shared library
- Configuration files: sefstars.txt, seleapsec.txt, seorbel.txt
- Ephemeris files in the ephe/ subdirectory

## License

The Swiss Ephemeris is licensed under either the AGPL or a commercial license.
See the original package for full license details.
