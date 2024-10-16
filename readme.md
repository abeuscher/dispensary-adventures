# Dispensary Adventures

## Overview

**Dispensary Adventures** is a static site built with [Eleventy (11ty)](https://www.11ty.dev/), [Swiper](https://swiperjs.com/), [Lodash](https://lodash.com/), [Sass](https://sass-lang.com/), and [Contentful](https://www.contentful.com/), with additional tools like [Prettier](https://prettier.io/) for code formatting. This site is designed to power [dispensaryadventures.com](https://dispensaryadventures.com/).

## Features

- **11ty**: Static site generation for fast and flexible website builds.
- **Swiper**: Powerful and flexible sliders and carousels.
- **Lodash**: JavaScript utility library for simplifying data manipulation.
- **Sass**: CSS preprocessor to help maintain styles efficiently.
- **Contentful**: Content Management System integration for easy content handling.
- **Prettier**: Automated code formatting for consistent style.

## Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abeuscher/dispensary-adventures.git
   ```

2. Navigate to the project directory:

   ```bash
   cd dispensary-adventures
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Add a `.env` file to the project root and include your Contentful API credentials:

   ```bash
   CONTENTFUL_SPACE_ID=your-space-id
   CONTENTFUL_ACCESS_TOKEN=your-access-token
   ```

## Usage

### Development

To start a local development server, run:

```bash
npm start
```

This will run Eleventy with live reloading on `localhost:8080`.

### Build for Production

To build the static site for production:

```bash
npm run build
```

This will generate the static site and bundle assets using Webpack.

### Watch for Changes

To watch for file changes and automatically rebuild the site:

```bash
npm run watch
```

### Format Code

To format the code with Prettier:

```bash
npm run format
```

### Clean

To remove the `_site` folder and clean the build:

```bash
npm run clean
```

## Project Structure

- **\_site/**: Output folder where the static files are generated.
- **src/**: Contains all source files including templates, styles, and scripts.
- **.eleventy.js**: Configuration file for Eleventy.
- **webpack.config.js**: Configuration for Webpack bundling.
- **.env**: Environment variables for Contentful and other settings.

## Contributions

Feel free to submit issues and pull requests. All contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
