import {gql} from "@urql/core";
const GET_WORLD = gql`
  query getWorld($user: String!) {
    getWorld(user: $user) {
      name
      angelbonus
      logo
      money
      score
      totalangels
      activeangels
      products{
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers{
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks{
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades{
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades{
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers{
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;

const LANCER_PRODUCTION = gql`
  mutation lancerProductionProduit($user: String!, $id: Int!) {
    lancerProductionProduit(user: $user, id: $id) {
      id
    }
  }`;

const ENGAGER_MANAGER = gql`
  mutation engagerManager($user: String!, $name: String!) {
    engagerManager(user: $user, name: $name) {
      name
    }
  }
`;

const ACHETER_PRODUIT = gql`
  mutation acheterQtProduit($user: String!, $id: Int!, $quantite: Int!) {
    acheterQtProduit(user: $user, id: $id, quantite: $quantite) {
      id
    }
  }
`;

const ACHETER_CASH_UPGRADE = gql`
  mutation acheterCashUpgrade($user: String!, $name: String!) {
    acheterCashUpgrade(user: $user, name: $name) {
      name
    }
  }
`;

const ACHETER_ANGEL_UPGRADE = gql`
  mutation acheterAngelUpgrade($user: String!, $name: String!) {
    acheterAngelUpgrade(user: $user, name: $name) {
      name
    }
  }
`;

const RESET_WORLD = gql`
  mutation resetWorld($user: String!) {
    resetWorld(user: $user) {
      name
      angelbonus
      logo
      money
      score
      totalangels
      activeangels
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;


export { GET_WORLD, LANCER_PRODUCTION, ENGAGER_MANAGER, ACHETER_PRODUIT, ACHETER_CASH_UPGRADE, ACHETER_ANGEL_UPGRADE, RESET_WORLD };