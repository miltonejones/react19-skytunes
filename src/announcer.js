const dotless = (str) => str?.replace(/\./g, "");

export async function announceChange(
  artist,
  title,
  ms,
  chatType,
  onSpeechStart = null,
  onSpeechEnd = null
) {
  if (ms < 150000) {
    return onSpeechEnd();
  }
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({
      artist: dotless(artist),
      title: dotless(title),
    }),
  };
  const response = await fetch(
    "https://ismvqzlyrf.execute-api.us-east-1.amazonaws.com/" + chatType,
    requestOptions
  );

  const json = await response.json();

  if (!json.messageContent) {
    return onSpeechEnd();
  }

  // Parse introduction from first message in choices.
  const { messageContent } = json;

  console.log({ json });

  const utterance = new SpeechSynthesisUtterance(messageContent);
  // Set up event listeners for speech start and end
  utterance.onstart = function (event) {
    console.log("Speech started");
    if (onSpeechStart && typeof onSpeechStart === "function") {
      onSpeechStart(event, messageContent);
    }
  };

  utterance.onend = function (event) {
    console.log("Speech ended");
    if (onSpeechEnd && typeof onSpeechEnd === "function") {
      onSpeechEnd(event, messageContent);
    }
  };

  // Optional: Configure voice properties
  utterance.rate = 1.0; // Speaking rate (0.1 to 10)
  utterance.pitch = 1.0; // Pitch (0 to 2)
  utterance.volume = 1.0; // Volume (0 to 1)
  utterance.lang = "en-US";

  // Speak the text
  window.speechSynthesis.speak(utterance);

  return true;
}
