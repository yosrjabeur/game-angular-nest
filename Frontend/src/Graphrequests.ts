import { gql } from "@urql/core";

export const GET_WORLD = gql`
 query getWorld($user: String!) {
   getWorld(user: $user) {
     name
     angelbonus
     logo
     money
     score
     totalangels
     lastupdate
     products {
       timeleft
       quantite
       vitesse
       revenu
       croissance
       cout
       logo
       name
       id
     }
   }
 }
`;
