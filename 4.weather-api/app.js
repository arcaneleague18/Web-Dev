// Weather API key and endpoint
const apiKey = "18edcf34c5d0eb6bb60e843bf9d0be31";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// Store a reference to the chart instance for cleanup
let chartInstance = null;

/**
 * Fetches the weather data for the city entered by the user and draws the temperature chart.
 */
const getWeather = async () => {
  const cityInput = document.getElementById("city");
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city name");

  try {
    const res = await fetch(`${apiUrl}?q=${encodeURIComponent(city)}&units=metric&cnt=7&appid=${apiKey}`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    const labels = data.list.map(d => d.dt_txt.split(" ")[0]);
    const temps = data.list.map(d => d.main.temp);
    drawChart(labels, temps);
  } catch (err) {
    alert(err.message);
  }
};

/**
 * Draws (or updates) the temperature line chart given the labels and temperature values.
 * Destroys the previous chart instance to prevent memory leaks.
 */
const drawChart = (labels, temps) => {
  const chartElem = document.getElementById("chart");
  // Destroy previous chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chartElem, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Temperature (°C)", data: temps, borderColor: "blue" }]
    },
    options: { responsive: true }
  });
};
