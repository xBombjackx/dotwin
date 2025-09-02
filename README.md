# dotwin

A simple chat aggregator that allows you to view chats from Twitch, YouTube, and TikTok in a single application.

## Features

- Aggregates chat messages from Twitch, YouTube, and TikTok.
- Allows you to configure the chat sources through a simple UI.
- Automatically reconnects to the chat sources when the configuration is updated.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/xBombjackx/dotwin.git
    cd dotwin
    ```

2.  **Install server dependencies:**

    ```bash
    npm install --prefix server
    ```

3.  **Install client dependencies:**

    ```bash
    npm install --prefix client
    ```

## Running the Application

1.  **Start the server:**

    ```bash
    npm start --prefix server
    ```

    The server will be running on `http://localhost:3001`.

2.  **Start the client:**

    ```bash
    npm start --prefix client
    ```

    The client will be running on `http://localhost:3000`.

## Configuration

1.  Open the application in your browser at `http://localhost:3000`.
2.  Click on the "Settings" button.
3.  Enter the required information for each platform:
    *   **Twitch:** The username of the channel you want to connect to.
    *   **YouTube:** The Live ID of the stream you want to connect to.
    *   **TikTok:** The username of a user who is currently live.
4.  Click "Save". The server will automatically restart and connect to the new chat sources.

**Note:** You will need to provide your own YouTube API key in a `.env` file in the `server` directory. Create a file named `.env` in the `server` directory and add the following line:

```
YOUTUBE_API_KEY=your_api_key
```