import { gql } from "../../__generated__";

export const CC_ME = gql(`query CcMe {
  ccMe {
    id
    fullName
    email
    phoneNumber
    status
    profilePic
    alias
    internal_external
    isDeleted
    role {
      id
      name
      description
      isDeleted
      displayName
      permissions {
        id
        name
        description
        displayName
      } 
      custom
      userCount
    }
    front {
      id
      name
      isDefault
      business {
        id
        name
        type
        activeTabs {
          isVisible
          path
        }
      }
    }
    team {
      id
      name
      teamAlias
      isDefault
    }
    agency {
      id
      name
      email
      status
      alias
      description
      userCount
      frontCount
      teamCount
      platformCount
      assetsCount
    }
    department {
      id
      name
    }
    userSettings {
      id
      settingOptions {
        timeZone
        offset
        currency
        name
        language
      }
      isDeleted
    }
  }
}`);
