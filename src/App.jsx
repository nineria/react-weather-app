import './App.css'
import { toPng } from 'html-to-image'
import React, { useCallback, useRef } from 'react'

const APIKey = 'eb22da71d7fc3c2f2810041e3a98c9fc'

function uid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function App() {
  const ref = useRef(null)

  const onButtonClick = useCallback(() => {
    // console.log(uid(10))
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${uid(10)}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  function checkWeather(json) {
    const image = document.querySelector('.weather-box img')
    switch (json.weather[0].main) {
      case 'Clear':
        image.src = '/images/clear.png'
        break

      case 'Rain':
        image.src = '/images/rain.png'
        break

      case 'Snow':
        image.src = '/images/snow.png'
        break

      case 'Clouds':
        image.src = '/images/cloud.png'
        break

      case 'Haze':
        image.src = '/images/mist.png'
        break

      default:
        image.src = ''
    }
  }

  function fetchWeather() {
    const container = document.querySelector('.container')
    const weatherBox = document.querySelector('.weather-box')
    const weatherDetails = document.querySelector('.weather-details')
    const error404 = document.querySelector('.not-found')

    const city = document.querySelector('.search-box input').value

    if (city === '') return

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.cod === '404') {
          container.style.height = '400px'
          weatherBox.style.display = 'none'
          weatherDetails.style.display = 'none'
          error404.style.display = 'block'
          error404.classList.add('fadeIn')
          return
        }

        error404.style.display = 'none'
        error404.classList.remove('fadeIn')

        checkWeather(json)

        const temperature = document.querySelector('.weather-box .temperature')
        const description = document.querySelector('.weather-box .description')
        const humidity = document.querySelector(
          '.weather-details .humidity span'
        )
        const wind = document.querySelector('.weather-details .wind span')

        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`
        description.innerHTML = `${json.weather[0].description}`
        humidity.innerHTML = `${json.main.humidity}%`
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`

        weatherBox.style.display = ''
        weatherDetails.style.display = ''
        weatherBox.classList.add('fadeIn')
        weatherDetails.classList.add('fadeIn')
        container.style.height = '590px'
      })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchWeather()
    }
  }

  return (
    <>
      <div ref={ref} className='container'>
        <div className='search-box'>
          <i className='fa-solid fa-location-dot'></i>
          <input
            onKeyDown={handleKeyDown}
            id='textEl'
            type='text'
            placeholder='Enter your location'
          />
          <button
            onClick={fetchWeather}
            className='fa-solid fa-magnifying-glass'
          ></button>
        </div>

        <div className='not-found'>
          <img src='/images/404.png' />
          <p>Oops! Invalid location :/</p>
        </div>

        <div className='weather-box'>
          <img src='' />
          <p className='temperature'></p>
          <p className='description'></p>
        </div>

        <div className='weather-details'>
          <div className='humidity'>
            <i className='fa-solid fa-water'></i>
            <div className='text'>
              <span></span>
              <p>Humidity</p>
            </div>
          </div>
          <div className='wind'>
            <i className='fa-solid fa-wind'></i>
            <div className='text'>
              <span></span>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
      <button className='save-image' onClick={onButtonClick}>
        Save Image
      </button>
      <div className='author'>
        © {new Date().getFullYear()} Tewarit Jantarasorn. All Rights Reserved.
      </div>
    </>
  )
}

export default App
