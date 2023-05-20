import React from 'react';
import { useState } from 'react';
import { Stack, Input, InputGroup, InputLeftElement, Text, Heading, Center, Link, Flex } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import Lottie from 'lottie-react';
import cities from 'cities.json';
import axios from 'axios';
import { format } from 'date-fns';

import './style.css';
import Sunny from '/src/images/sunny.json';
import Cloudy from '/src/images/cloudy.json';
import Mist from '/src/images/mist.json';
import Rain from '/src/images/storm.json';
import Snow from '/src/images/snow.json';
import Drizzle from '/src/images/drizzle.json';
import Weather from '/src/images/weather.json';
import Night from '/src/images/night.json';
import CloudyNight from '/src/images/cloudy_night.json';
import RainyNight from '/src/images/rainy_night.json';

import { BsInstagram } from 'react-icons/bs';
import { FiGithub, FiLinkedin } from 'react-icons/Fi';

export default function Home() {

    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(true);

    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1e51ca93e86f58c4f8fccad9bc182dda&units=metric`;

    const searchLocation = async (e) => {
        if (e.key === 'Enter') {
            setShowDropdown(false);

            await axios.get(urlWeather).then((response) => {

                let imagePath = '';
                let weatherClass = '';


                const currentDate = format(new Date(), 'MMMM dd, yyyy');
                const newDate = new Date()
                const sunrise = new Date(response.data.sys.sunrise * 1000);
                const sunset = new Date(response.data.sys.sunset * 1000);

                if (newDate > sunrise && newDate < sunset) {
                    if (response.data.weather[0].main == 'Clouds') {
                        imagePath = Cloudy;
                        weatherClass = 'summer';
                    } else if (response.data.weather[0].main == 'Clear') {
                        imagePath = Sunny;
                        weatherClass = 'summer';
                    } else if (response.data.weather[0].main == 'Rain') {
                        imagePath = Rain;
                        weatherClass = 'winter';
                    } else if (response.data.weather[0].main == 'Drizzle') {
                        imagePath = Drizzle;
                        weatherClass = 'winter';
                    } else if (response.data.weather[0].main == 'Mist') {
                        imagePath = Mist;
                        weatherClass = 'winter';
                    } else if (response.data.weather[0].main == 'Snow') {
                        imagePath = Snow;
                        weatherClass = 'winter';
                    }
                } else {
                    if (response.data.weather[0].main == 'Clouds') {
                        imagePath = CloudyNight;
                        weatherClass = 'night';
                    } else if (response.data.weather[0].main == 'Clear') {
                        imagePath = Night;
                        weatherClass = 'night';
                    } else if (response.data.weather[0].main == 'Drizzle') {
                        imagePath = RainyNight;
                        weatherClass = 'night';
                    }
                }

                setData({
                    ...data,
                    main: response.data.main,
                    celcius: response.data.main.temp,
                    name: response.data.name,
                    date: currentDate,
                    humidity: response.data.main.humidity,
                    speed: response.data.wind.speed,
                    feels: response.data.main.feels_like,
                    weather: response.data.weather[0].main,
                    image: imagePath
                });
                setError('');
                document.querySelector('.bg').classList = `bg ${weatherClass}`;
            }).catch(err => {
                if (err.response.status == 404) {
                    setError('Invalid city name');
                } else {
                    setError('');
                }
            });
            setLocation('');
        } else {
            setShowDropdown(true);
        }
    };

    const onSearch = (searchTerm) => {
        setLocation(searchTerm);
        setShowDropdown(false);
        // our api to fetch the search result
        console.log("search ", searchTerm);
    };

    return (
        <div className="container">
            <div className="bg">
                <div className="weather">
                    <div className="search">
                        <Stack spacing={4}>
                            <InputGroup >
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<Search2Icon color='gray.300' />}
                                />
                                <Input
                                    type='text'
                                    placeholder='Search for a city'
                                    focusBorderColor='gray.700'
                                    value={location}
                                    onChange={e => {
                                        setLocation(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onKeyPress={searchLocation}
                                />
                            </InputGroup>
                            {showDropdown && (
                                <div className="dropdown">
                                    {cities
                                        .filter((item) => {
                                            const searchTerm = location.toLowerCase();
                                            const fullName = item.name.toLowerCase();

                                            return (
                                                searchTerm &&
                                                fullName.startsWith(searchTerm) &&
                                                fullName !== searchTerm
                                            );
                                        })
                                        .slice(0, 10)
                                        .map((item) => (
                                            <div
                                                onClick={() => onSearch(item.name)}
                                                className="dropdown-row"
                                                key={item.name}
                                            >
                                                {item.name}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </Stack>
                    </div>

                    <div className="error">
                        <Text>{error}</Text>
                    </div>

                    <div className="winfo">
                        <Heading as='h2' size='3xl' fontWeight='400' mb='20px' fontFamily='Poppins, sans-serif'>
                            {data.name}
                            {data.date && (
                                <Text as='p' fontSize='md' fontWeight='normal' mt='10px' ml='10px'>
                                    {data.date}
                                </Text>
                            )}
                        </Heading>

                        <div className='temp_img'>
                            <Lottie loop={true} animationData={data.image}></Lottie>
                        </div>
                        <Text fontSize='2xl'>{data.weather}</Text>
                        {data.main ?
                            <Heading as='h1'
                                fontSize='6xl'
                                fontWeight='500'
                                fontFamily='Poppins, sans-serif'
                                ml='10px'
                                mt='20px'>
                                {Math.round(data.celcius)}°
                            </Heading>
                            : <Lottie loop={true} animationData={Weather}></Lottie>}
                    </div>

                    <div className="middle">
                        {data.main ?
                            <h1></h1>
                            : <Heading as='h2' size='2xl' textAlign='center' fontWeight='400' fontFamily='Poppins, sans-serif'>Welcome to WeatherApp</Heading>}
                    </div>

                    {data.name !== undefined &&
                        <div className='bottom'>

                            <hr color='black' />

                            <div className="details">
                                <div className="col">
                                    <img src="https://img.icons8.com/ios/50/null/thermometer.png" />
                                    <div>
                                        <Text as='b'>FEELS LIKE</Text>
                                        {data.main ? <Text>{Math.round(data.feels)}°</Text> : null}
                                    </div>
                                </div>
                                <div className="col">
                                    <img src="https://img.icons8.com/ios/50/null/humidity.png" />
                                    <div>
                                        <Text as='b'>HUMIDITY</Text>
                                        {data.main ? <Text>{data.humidity}%</Text> : null}
                                    </div>
                                </div>
                                <div className="col">
                                    <img src="https://img.icons8.com/ios/50/null/wind--v1.png" />
                                    <div>
                                        <Text as='b'>WIND</Text>
                                        {data.main ? <Text>{Math.round(data.speed)} km/h</Text> : null}
                                    </div>
                                </div>

                            </div>

                        </div>
                    }

                    <div className="footer">
                        <Flex justify='space-around' direction='row' h='100px' p={4}>
                            <Center>
                                <Link href="https://www.instagram.com/itaylevy2/" mr='10px'><BsInstagram cursor='pointer' className='contact_icons' /></Link>
                                <Link href="https://www.linkedin.com/in/itaylevy2/" mr='10px'><FiLinkedin cursor='pointer' className='contact_icons' /></Link>
                                <Link href="https://github.com/ItayLevy1"><FiGithub cursor='pointer' className='contact_icons' /></Link>
                            </Center>
                        </Flex>

                    </div>
                </div>

            </div>

        </div>
    )
}