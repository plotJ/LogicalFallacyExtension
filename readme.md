# Logical Fallacy Detector Chrome Extension

This Chrome extension uses OpenAI's GPT model to detect logical fallacies in web page content.

![Fallacy Example](fallacyexample.png)

## Features

- Analyzes web page content for logical fallacies
- Highlights detected fallacies on the page
- Displays detailed explanations of detected fallacies in the extension popup

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar.
2. Click the "Detect Fallacies" button to analyze the current page.
3. View detected fallacies in the popup and see highlights on the page.

## Configuration

Before using the extension, you need to add your OpenAI API key:

1. Open `background.js`.
2. Replace `'your_api_key_here'` with your actual OpenAI API key.

**Note:** Keep your API key confidential and do not share it publicly.

## Files

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup UI
- `popup.js`: Popup functionality
- `content.js`: Content script for webpage interaction
- `background.js`: Background script for API communication

## Development

To modify the extension:

1. Make changes to the relevant files.
2. Reload the extension on the `chrome://extensions/` page.
3. Test the changes on various web pages.

## Security Note

This extension sends web page content to the OpenAI API for analysis. Ensure you comply with privacy regulations and inform users about data transmission.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
