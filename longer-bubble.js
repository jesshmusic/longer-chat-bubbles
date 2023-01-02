
Hooks.once('init', () => {
    console.log("Loaded Longer Chat Bubbles");

    game.settings.register("longer-chat-bubbles", "bubbleMinTime", {
      name: "Min Time",
      hint: "Minimum amount of time in seconds for the chat bubble",
      scope: "client",
      config: true,
      type: Number,
      range: {min: 1, max: 60, step: 1},
      default: 3,
      onChange: () => {
        canvas.hud.bubbles = new LongerChatBubbles()
      }
    });

    game.settings.register("longer-chat-bubbles", "bubbleMaxTime", {
      name: "Max Time",
      hint: "Maximum amount of time in seconds for the chat bubble",
      scope: "client",
      config: true,
      type: Number,
      range: {min: 20, max: 60, step: 1},
      default: 25,
      onChange: () => {
        canvas.hud.bubbles = new LongerChatBubbles()
      }
    });

});

Hooks.once('ready', () => {
  canvas.hud.bubbles = new LongerChatBubbles()
});

class LongerChatBubbles extends ChatBubbles {
  constructor(...args) {
    super(...args);
  }

  /**
   * Determine the length of time for which to display a chat bubble.
   * Research suggests that average reading speed is 200 words per minute.
   * Since these are short-form messages, we multiply reading speed by 1.5.
   * Clamp the result between 1 second (minimum) and 20 seconds (maximum)
   * @param {jQuery} html     The HTML message
   * @returns {number}        The number of milliseconds for which to display the message
   */
  _getDuration(html) {
    const words = html.text().split(/\s+/).reduce((n, w) => n + Number(!!w.trim().length), 0);
    const ms = (words * 60 * 1000) / 300;
    let timeMin = game.settings.get("longer-chat-bubbles", "bubbleMinTime");
    let timeMax = game.settings.get("longer-chat-bubbles", "bubbleMaxTime");

    return Math.clamped(timeMin * 1000, ms, timeMax * 1000);
  }

}