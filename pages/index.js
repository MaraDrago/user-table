import Head from "next/head";
import UsersTable from "../components/usersTable";

function Page({ users }) {
  return (
    <div>
      <Head>
        <title>Users Table</title>
      </Head>
      <UsersTable users={users} />;
    </div>
  );
}

Page.getInitialProps = async (ctx) => {
  // fetch and parse users
  const response = await fetch("https://fww-demo.herokuapp.com/");
  const countries = await response.json();

  // returns array of arrays of user arrays from all countries
  const getUsersFromCountry = countries.map((country) => {
    // returns array of user arrays from current country
    return country.state.map((state) => {
      // returns users array from current state
      return state.users.map((user) => {
        // return user object with added state and county props needed for the table
        return { ...user, state: state.name, country: country.country };
      });
    });
  });

  // double flatten array of arrays of user arrays from all countries, to get an array of user objects from all countries combined
  const users = getUsersFromCountry
    .reduce((accumulator, userArray) => accumulator.concat(userArray), [])
    .reduce((accumulator, user) => accumulator.concat(user), []);

  return {
    users,
  };
};
export default Page;
