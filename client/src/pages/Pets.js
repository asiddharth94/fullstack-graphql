import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const ALL_PETS = gql`
  query AllPets {
    pets {
      id
      img
      name
      type
    }
  }
`;

const ADD_PET = gql`
  mutation AddPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);

  const { loading, data, error } = useQuery(ALL_PETS);
  // declaring newPet object because JS will get confused about duplicate {data, loading, error}
  // With newPet, we can access the properties using dot notation
  const [createPet, newPet] = useMutation(ADD_PET);

  if (loading || newPet.loading) {
    return <Loader />;
  }
  if (error || newPet.error) {
    return <h1>Error!</h1>;
  }

  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: {
        newPet: {
          name: input.name,
          type: input.type,
        },
      },
    });
  };

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
