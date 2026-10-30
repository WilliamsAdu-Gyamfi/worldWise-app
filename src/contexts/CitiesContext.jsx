import { createContext, useContext, useEffect, useState } from "react";
import City from "../components/City";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const CitiesProvider = function ({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was an error Loading data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error Loading data");
    } finally {
      setIsLoading(false);
    }
  }

  // async function createCity(newCity) {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(`${BASE_URL}/cities`, {
  //       method: "POST",
  //       body: JSON.stringify(newCity),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();
  //     setCurrentCity(data);
  //   } catch {
  //     alert("There was an error Loading data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function createCity(newCity) {
    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to create city");

      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (err) {
      alert("There was an error creating the city");
      // console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      alert("There was an error deleting the city");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = function () {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside the cites provider");
  return context;
};

export { CitiesProvider, useCities };
