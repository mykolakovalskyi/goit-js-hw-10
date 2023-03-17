import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener(
  'input',
  debounce(event => {
    let name = event.target.value.trim();

    if (name === '') {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return;
    }

    fetchCountries(name)
      .then(response => {
        if (response.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          return;
        }
        if (response.length <= 10 && response.length >= 2) {
          renderCountries(response);
        } else {
          renderCountry(response);
        }
      })
      .catch(error => {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }, DEBOUNCE_DELAY)
);

function renderCountries(countries) {
  countryInfo.innerHTML = '';
  const markup = countries
    .map(({ flags, name }) => {
      return `<p style="font-size:20px"><img src="${flags.svg}" alt="${name.official}" width="50" height="30" style="margin-right:5px"/> ${name.official}</p>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountry(country) {
  countryList.innerHTML = '';
  const markup = country.map(
    ({ flags, name, capital, population, languages }) =>
      `<h1><img src="${flags.svg}" alt="${
        name.official
      }" width="50" height="30" style="margin-right:5px"/> ${name.official}</h1>
      <p style="font-size:22px"><b>Capital:</b> ${capital}</p>
      <p style="font-size:22px"><b>Population:</b> ${population}</p>
      <p style="font-size:22px"><b>languages:</b> ${Object.values(
        languages
      )}</p>`
  );
  countryInfo.innerHTML = markup;
}
