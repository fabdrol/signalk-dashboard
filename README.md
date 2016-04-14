# volare-signalk-dashboard

> Signal K dashboard for the Volare, with Depth, STW, SOG, Position, Heading etc

## Widgets
The current version provides the following widgets:
- Speed (over ground and through water)
- Course (over ground)
- Position (2D)
- Depth

Additionally, when tapping the position widget, you can input another position to calculate distance and heading to that position (useful to determine your position relative to the competition in a race, or to find out how far a point is).

A few other widgets and features are planned for next versions:
- An AIS graph with nearby vessels
- Time (selectable timezones)
- Log/trip log
- Water temperature

Currently, the connection details to the Signal K server are stored in `src/config.json`. Changing them required a rebuild.

## Build scripts
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
