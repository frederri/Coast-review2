
#### Divergent

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 6.21 s | 5.51 s | 1.13× | 6.91 s | 5.69 s | 1.21× | 5.94 s | 5.68 s | 1.05× |
| New coast | 6.19 s | 4.96 s | 1.25× | 5.37 s | 4.77 s | 1.13× | 5.21 s | 4.82 s | 1.08× |
| change width to this | 4.15 s | 56.0 ms | 74.07× | 4.46 s | 52.0 ms | 85.75× | 4.83 s | 55.0 ms | 87.89× |
| switch character to this | 4.26 s | 87.0 ms | 48.99× | 4.75 s | 84.0 ms | 56.52× | 4.59 s | 102 ms | 45.04× |
| mode: Peninsula | 4.18 s | 96.0 ms (1st: 3.77 s) | 43.54× | 4.85 s | 90.0 ms (1st: 4.37 s) | 53.90× | 4.86 s | 93.0 ms (1st: 4.64 s) | 52.20× |
| mode: Inland sea | 5.27 s | 84.0 ms (1st: 5.58 s) | 62.79× | 5.61 s | 90.0 ms (1st: 6.31 s) | 62.28× | 5.84 s | 76.0 ms (1st: 5.97 s) | 76.80× |
| mode: Coast | 4.51 s | 105 ms | 42.95× | 4.76 s | 80.0 ms | 59.49× | 4.99 s | 82.0 ms | 60.90× |
| switch to Points | 4.88 s | 4.26 s | 1.15× | 4.54 s | 4.74 s | 0.96× | 4.53 s | 4.07 s | 1.11× |
| switch to Tilt | 4.78 s | 4.98 s | 0.96× | 4.84 s | 4.40 s | 1.10× | 4.27 s | 4.27 s | 1.00× |
| Tilt drag preview frame | 30.9 ms | 24.9 ms | 1.24× | 31.9 ms | 27.0 ms | 1.18× | 29.6 ms | 27.1 ms | 1.09× |
| release dot (Tilt) | 4.71 s | 88.0 ms (1st: 4.93 s) | 53.47× | 4.99 s | 89.0 ms (1st: 5.01 s) | 56.11× | 4.86 s | 83.0 ms (1st: 4.59 s) | 58.55× |
| release dot (Points) | 4.46 s | 4.47 s | 1.00× | 4.68 s | 4.33 s | 1.08× | 4.58 s | 4.14 s | 1.11× |
| Random dots (Tilt) | 4.96 s | 4.47 s | 1.11× | 5.14 s | 4.54 s | 1.13× | 4.61 s | 4.63 s | 1.00× |
| Random dots (Points) | 4.41 s | 4.35 s | 1.01× | 4.73 s | 4.37 s | 1.08× | 4.32 s | 4.05 s | 1.07× |
| window resize (incl. 150 ms debounce) | 4.67 s | 223 ms (1st: 5.61 s) | 20.96× | 5.10 s | 225 ms (1st: 4.99 s) | 22.65× | 5.51 s | 229 ms (1st: 5.71 s) | 24.04× |

#### Jagged

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 5.83 s | 5.17 s | 1.13× | 5.76 s | 5.33 s | 1.08× | 5.85 s | 5.52 s | 1.06× |
| New coast | 4.85 s | 4.12 s | 1.18× | 5.44 s | 5.29 s | 1.03× | 5.10 s | 4.38 s | 1.17× |
| change width to this | 4.18 s | 49.0 ms | 85.27× | 4.12 s | 50.0 ms | 82.44× | 4.32 s | 63.0 ms | 68.63× |
| switch character to this | 4.34 s | 89.0 ms | 48.74× | 4.67 s | 84.0 ms | 55.63× | 4.90 s | 90.0 ms | 54.49× |
| mode: Peninsula | 4.37 s | 87.0 ms (1st: 4.16 s) | 50.25× | 4.36 s | 88.0 ms (1st: 4.06 s) | 49.50× | 4.81 s | 85.0 ms (1st: 4.29 s) | 56.59× |
| mode: Inland sea | 4.63 s | 81.0 ms (1st: 5.11 s) | 57.22× | 5.02 s | 90.0 ms (1st: 5.40 s) | 55.74× | 5.17 s | 85.0 ms (1st: 5.89 s) | 60.84× |
| mode: Coast | 4.46 s | 81.0 ms | 55.01× | 4.33 s | 82.0 ms | 52.85× | 4.58 s | 79.0 ms | 57.97× |
| switch to Points | 4.21 s | 3.79 s | 1.11× | 4.40 s | 4.17 s | 1.05× | 4.33 s | 4.31 s | 1.00× |
| switch to Tilt | 4.16 s | 3.92 s | 1.06× | 4.36 s | 4.13 s | 1.06× | 4.32 s | 4.21 s | 1.03× |
| Tilt drag preview frame | 30.5 ms | 27.8 ms | 1.10× | 36.1 ms | 29.5 ms | 1.22× | 35.4 ms | 32.2 ms | 1.10× |
| release dot (Tilt) | 4.29 s | 106 ms (1st: 4.17 s) | 40.52× | 4.48 s | 87.0 ms (1st: 4.06 s) | 51.49× | 2.65 s | 92.0 ms (1st: 4.20 s) | 28.86× |
| release dot (Points) | 4.00 s | 3.81 s | 1.05× | 4.14 s | 4.40 s | 0.94× | 4.42 s | 4.12 s | 1.07× |
| Random dots (Tilt) | 4.36 s | 3.92 s | 1.11× | 4.45 s | 4.25 s | 1.04× | 4.72 s | 4.35 s | 1.09× |
| Random dots (Points) | 4.33 s | 3.79 s | 1.14× | 4.30 s | 4.24 s | 1.02× | 4.45 s | 4.33 s | 1.03× |
| window resize (incl. 150 ms debounce) | 4.71 s | 239 ms (1st: 5.07 s) | 19.70× | 4.87 s | 292 ms (1st: 5.59 s) | 16.68× | 4.74 s | 240 ms (1st: 6.02 s) | 19.76× |

#### Graded shoreline

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 13.67 s | 13.29 s | 1.03× | 13.29 s | 12.32 s | 1.08× | 12.40 s | 12.14 s | 1.02× |
| New coast | 12.52 s | 12.04 s | 1.04× | 12.39 s | 12.13 s | 1.02× | 11.77 s | 11.54 s | 1.02× |
| change width to this | 11.37 s | 49.0 ms | 231.98× | 11.99 s | 47.0 ms | 255.09× | 11.72 s | 54.0 ms | 217.04× |
| switch character to this | 12.01 s | 73.0 ms | 164.55× | 12.69 s | 78.0 ms | 162.67× | 12.05 s | 91.0 ms | 132.43× |
| mode: Peninsula | 4.93 s | 85.0 ms (1st: 4.87 s) | 58.02× | 5.22 s | 88.0 ms (1st: 5.15 s) | 59.28× | 5.24 s | 78.0 ms (1st: 5.00 s) | 67.12× |
| mode: Inland sea | 5.87 s | 92.0 ms (1st: 6.08 s) | 63.82× | 5.98 s | 110 ms (1st: 5.62 s) | 54.36× | 5.34 s | 91.0 ms (1st: 5.66 s) | 58.64× |
| mode: Coast | 12.14 s | 81.0 ms | 149.91× | 12.92 s | 83.0 ms | 155.71× | 12.32 s | 90.0 ms | 136.89× |
| switch to Points | 11.24 s | 11.51 s | 0.98× | 12.68 s | 11.76 s | 1.08× | 11.85 s | 12.11 s | 0.98× |
| switch to Tilt | 11.35 s | 11.38 s | 1.00× | 12.52 s | 12.52 s | 1.00× | 11.88 s | 11.32 s | 1.05× |
| Tilt drag preview frame | 29.8 ms | 26.5 ms | 1.12× | 30.2 ms | 27.1 ms | 1.11× | 31.1 ms | 26.0 ms | 1.20× |
| release dot (Tilt) | 11.17 s | 91.0 ms (1st: 11.09 s) | 122.77× | 12.81 s | 100 ms (1st: 12.30 s) | 128.13× | 11.92 s | 82.0 ms (1st: 10.87 s) | 145.33× |
| release dot (Points) | 11.56 s | 11.46 s | 1.01× | 12.44 s | 12.44 s | 1.00× | 11.98 s | 11.43 s | 1.05× |
| Random dots (Tilt) | 11.44 s | 11.27 s | 1.01× | 13.22 s | 12.26 s | 1.08× | 11.92 s | 11.66 s | 1.02× |
| Random dots (Points) | 12.03 s | 11.41 s | 1.05× | 12.87 s | 12.57 s | 1.02× | 12.25 s | 11.44 s | 1.07× |
| window resize (incl. 150 ms debounce) | 11.33 s | 225 ms | 50.37× | 12.84 s | 226 ms | 56.80× | 11.50 s | 222 ms | 51.82× |

#### Mixed

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 17.34 s | 16.19 s | 1.07× | 15.05 s | 15.36 s | 0.98× | 15.50 s | 16.42 s | 0.94× |
| New coast | 15.04 s | 15.06 s | 1.00× | 14.13 s | 14.93 s | 0.95× | 15.33 s | 15.68 s | 0.98× |
| change width to this | 13.69 s | 47.0 ms | 291.17× | 15.84 s | 50.0 ms | 316.76× | 19.29 s | 52.0 ms | 370.92× |
| switch character to this | 13.58 s | 77.0 ms | 176.39× | 16.04 s | 83.0 ms | 193.29× | 19.79 s | 80.0 ms | 247.36× |
| mode: Peninsula | 4.94 s | 83.0 ms (1st: 4.99 s) | 59.49× | 4.77 s | 99.0 ms (1st: 4.83 s) | 48.18× | 4.61 s | 99.0 ms (1st: 4.68 s) | 46.61× |
| mode: Inland sea | 5.67 s | 83.0 ms (1st: 5.73 s) | 68.28× | 5.41 s | 80.0 ms (1st: 5.78 s) | 67.65× | 5.33 s | 83.0 ms (1st: 5.24 s) | 64.18× |
| mode: Coast | 14.51 s | 76.0 ms | 190.97× | 15.98 s | 82.0 ms | 194.84× | 19.58 s | 79.0 ms | 247.89× |
| switch to Points | 13.79 s | 13.71 s | 1.01× | 15.83 s | 15.42 s | 1.03× | 18.37 s | 18.43 s | 1.00× |
| switch to Tilt | 13.47 s | 13.54 s | 0.99× | 15.27 s | 15.67 s | 0.97× | 18.37 s | 17.30 s | 1.06× |
| Tilt drag preview frame | 28.6 ms | 25.2 ms | 1.13× | 28.5 ms | 25.6 ms | 1.11× | 28.8 ms | 25.5 ms | 1.13× |
| release dot (Tilt) | 14.22 s | 81.0 ms (1st: 13.80 s) | 175.62× | 15.78 s | 90.0 ms (1st: 16.24 s) | 175.30× | 19.95 s | 85.0 ms (1st: 19.74 s) | 234.72× |
| release dot (Points) | 14.96 s | 14.24 s | 1.05× | 15.52 s | 15.96 s | 0.97× | 18.95 s | 17.85 s | 1.06× |
| Random dots (Tilt) | 13.98 s | 13.62 s | 1.03× | 15.29 s | 15.77 s | 0.97× | 18.14 s | 18.18 s | 1.00× |
| Random dots (Points) | 14.90 s | 14.76 s | 1.01× | 15.40 s | 15.31 s | 1.01× | 17.95 s | 17.62 s | 1.02× |
| window resize (incl. 150 ms debounce) | 13.77 s | 221 ms | 62.31× | 15.18 s | 236 ms | 64.34× | 19.36 s | 221 ms | 87.59× |
