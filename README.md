# Table of Contents

- [Description](#description)
- [How it works](#how-it-works)
  - [Single Page Application](#single-page-application)
  - [Folder Structure](#folder-structure)
  - [Data Source](#data-source)
  - [Real-time Updates](#real-time-updates)
  - [Frontend Optimization](#frontend-optimization)
  - [Error Handling](#error-handling)
  - [System Design](#system-design)
- [Available scripts](#available-scripts)
- [Naming convention](#naming-convention)

# Description

**Satellite Monitor** is a modern web application that enables users to track and view the positions of satellites orbiting Earth. Built with React, the application fetches **TLE** (Two-Line Element) data from the public Celestrak API to display real-time information on all available satellites.

A key feature of the application is the ability to view satellite positions on an interactive 2D map, which updates in real-time. Satellite Monitor uses the **SGP-4** (Simplified General Perturbations) mathematical model implemented in JavaScript, allowing for accurate predictions of satellite movement and positioning based on current data.

With this tool, users can:

- browse a registry of satellites from around the world,
- track their current position and trajectory,
- access information on future predicted locations in orbit.
  
Satellite Monitor is not only a practical tool for those interested in space but also a valuable resource for educators, scientists, and all satellite technology enthusiasts.

# How it works

### Single Page Application

A Single Page Application (SPA) with React is a web application that loads a single HTML page and dynamically updates its content without the need to reload the entire page with each user interaction. This approach makes the application more responsive and delivers a smoother user experience.

In a React-based SPA, the entire user interface logic is managed on the client side. React divides the page into components, which are modular blocks of the interface. Each component manages its own state and logic, making the application easier to maintain and develop. When data changes in a component, React automatically updates the corresponding elements on the page, allowing users to see immediate changes without reloading.

By leveraging React and its Virtual DOM system, an SPA can quickly render changes and minimize the number of direct operations on the actual DOM, which improves the application's performance.

### Folder Structure

The folder structure is as follows:

- Features
  - Feature A
      - components
      - containers
      - data-access
      - utilis
      - types <br />
      ...
  - Feature B
    - same as above
- Shared
- Layouts

### Data Source

The Satellite Monitor application utilizes external data sources to provide accurate real-time information on satellite positioning and elevation.

**Celestrak API** – The primary data source for satellite tracking is the TLE (Two-Line Element) data, obtained from Celestrak’s public API. TLE data is regularly updated and includes orbital parameters essential for calculating and predicting satellite positions. This information is critical for real-time tracking and accurate display of satellite locations on the 2D map.

Example data:
```
STARLINK-1030           
1 44735U 19074Y   24302.67631388  .00000270  00000+0  37046-4 0  9999
2 44735  53.0540 277.7958 0001438  87.5103 272.6050 15.06385715273552
STARLINK-1031           
1 44736U 19074Z   24303.22183817  .00002994  00000+0  21992-3 0  9998
2 44736  53.0540 275.3445 0001379  96.8890 263.2255 15.06375432273815
```

**Open-Elevation API** – To enhance the tracking experience, the application also integrates the Open-Elevation API. This API provides precise elevation data for specified locations, which can be used to improve altitude-related calculations and visualization on the map. By combining elevation with satellite positioning, the application offers a more comprehensive view of satellite trajectories and altitudes in relation to the Earth's surface.

Example data:
```
{
  "results":
  [
    {
      "latitude":21.9345,
      "longitude":51.6196,
      "elevation":106.0
    },
  ]
}
```

These data sources work together to ensure that Satellite Monitor displays up-to-date, reliable information on both satellite positioning and ground elevation, supporting accurate visualization and prediction models.

### Real-time Updates

The Satellite Monitor application uses real-time updates to display satellite positions on the map accurately. This process is managed by the getSatellitePosition function, which calculates the satellite’s current position based on provided TLE (Two-Line Element) data and the current time. Here's how it works:

**Position Calculation** – The getSatellitePosition function takes the current time and TLE data (two lines of text specific to each satellite) as inputs. Using the TLE data, it generates a satellite record (satrec) via the twoline2satrec method, which sets up essential parameters for position calculations.

**Propagation and Conversion** – The function then propagates the satellite's position using propagate, returning the satellite’s position and velocity. From this, it extracts the position in ECI (Earth-Centered Inertial) coordinates and checks if the position is valid.

**Geodetic Conversion** – If a valid position is obtained, the function converts it to geodetic coordinates using eciToGeodetic, allowing for a more accurate placement of the satellite on the 2D map. This conversion calculates longitude, latitude, and altitude relative to the Earth’s surface.

Example input and output:
```
Input:
  getSatellitePosition(
      time: Tue Oct 29 2024 12:38:25 GMT+0100 (czas środkowoeuropejski standardowy),
      firstLineTle: 1 25544U 98067A   24303.40526963  .00046268  00000+0  79212-3 0  9996,
      seondLineTle: 2 25544  51.6406  10.5581 0009124 114.5833 332.9952 15.50728255479367
    )
Output:
  {
    longtitude: -26.91837909940682,
    latitude: 5.286754333718085,
    height: 411.53070869686326
  }

```

The position update frequency is adjustable in the application settings, with a default update interval of **1.5** seconds. This frequency enables a **near real-time tracking experience**, giving users an up-to-date view of each satellite’s movement across the Earth.

### Frontend Optimization

To display a large number of objects (10k) on a 2D map using OpenLayers, we utilized the WebGLPointsLayer, which leverages the GPU for rendering. This approach enables high rendering performance and reduces the load on the browser's main thread. Since position updates occur at regular intervals, position calculations and orbit drawing were moved to Web Workers, further offloading the main thread. Additionally, we optimized coordinate updates by splitting tasks into smaller chunks using requestAnimationFrame(). Only 1/10 of all objects are updated per frame, so it takes 10 frames to update all objects. This reduces the update time per frame (from ~200ms to ~22ms), thereby enhancing application smoothness.

Algorithm for splitting tasks:
```
const updateFeatures = (start: number) => {
    const end = Math.min(start + step, totalLength);

    for (let i = start; i < end; i++) {
      // update coordinates
    }

    if (end < totalLength) {
        requestAnimationFrame(() => updateFeatures(end));
    }
};

requestAnimationFrame(() => updateFeatures(0));
```

### Error Handling

When the application launches, it retrieves essential data from the Celestrak API. If an error occurs during data fetching—such as connection issues or API request limits being reached—a clear error message is displayed to inform the user. Celestrak’s API imposes rate limits on connection attempts, so if these limits are exceeded, the application will not repeatedly attempt to reconnect, which prevents further issues. Instead, it provides feedback on the failure to the user.

### System Design

The Satellite Monitor application leverages Chakra UI, a modern UI library that provides a flexible, accessible, and customizable design system. Chakra UI’s built-in design system offers a consistent and responsive layout, which simplifies building components that adapt seamlessly to various screen sizes and devices.

With Chakra UI, the application follows a design approach based on reusable, modular components that share a common style language. This includes predefined color schemes, spacing, typography, and component states, ensuring visual coherence throughout the interface. The design system also prioritizes accessibility, making it easier to implement features that adhere to web accessibility standards, providing an inclusive user experience for all.

By using Chakra UI's design system, Satellite Monitor achieves a cohesive, professional look while significantly reducing the time needed for UI development and ensuring that new components integrate smoothly with the existing design structure.

# Available scripts
 - `npm run dev` - starting application in dev mode
 - `npm run build` - build production version
 - `npm run preview` - starting application in production mode
 - `npm run lint` - running eslint

# Naming convention

### File naming convention
- kebab case

### Variable, type and interface naming convention

- interfaces should start with I letter
- types should start with T letter
- variables should be camelCase
- enums should be UPPER_CASE

### Git commit naming convention
Conventional commits convention is used as commits naming convention. Visit the [conventional commits page](https://www.conventionalcommits.org) to learn more.
