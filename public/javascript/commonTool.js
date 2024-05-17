/**
 * Plant object
 * @typedef {object} Plant
 * @property {number} plantId - unique Identifier of the plant (Primary Key)
 * @property {string} plantName - name of the plant
 * @property {string} description
 * @property {string} details
 * @property {string} datetime - time to see the plant
 * @property {Loc} locations - location of the plant
 * @property {Boolean} flowers - whether the plant has flower (yes/no)
 * @property {String} sunExposure - full sun/partial shade/full shade
 * @property {String} flowerCokor - the RGB value of the plant's color
 * @property {String} status - status of the identification (completed/in-progress)
 * @property {String} nickName - the name of current user
 * @property {String} photo - image stored in base64 format
 * @property {DBpedia} DBpedia - corresponding encyclopedia
 */

/**
 * Location object
 * @typedef {object} Loc
 * @property {number} lag - latitude of the location
 * @property {number} lng - longitude of the location
 *
 */

/**
 * DBpedia object
 * @typedef {object} DBpedia
 * @property {String} link
 * @property {String} name
 * @property {String} description
 * @property {String} genus - genus of the plant
 *
 */

/**
 * UpdateRequest object
 * @typedef {object} UpdateRequest
 * @property {string} plantId - The ID of the plant
 * @property {string} plantName - The new name of the plant
 * @property {string} nickName - The nickname of the user making the request
 * @property {string} creator - The nickname of the plant creator
 * @property {string} plantOriginalName - The original name of the plant
 * @property {string} date - The date of the request
 * @property {string} statusOfRequest - The status of the request (e.g., completed, in-progress)
 * @property {string} decision - The decision for the request (e.g., agree, reject)
 */

/**
 * chat object
 * @typedef {object} Chat
 * @property {String} plantId
 * @property {ChatEntry} chatList
 */

/**
* @typedef {Object} ChatEntry
* @property {string} nickName - The name of the user.
* @property {string} content - The content of the chat message.
* @property {Date} [date=Date.now] - The date when the message was created. Defaults to the current date and time.
*/
function getNickName(){
    let nickName=window.localStorage.getItem("userNickName")
    return nickName;
}

function setNickName(nickname){
    window.localStorage.setItem("userNickName",nickname);
}

function setPlantId(plantId){
    window.localStorage.setItem("plantId",plantId)
    // console.log(plantId+'has saved to localStorage')
}

function getPlantId(){
    return window.localStorage.getItem("plantId")
}

function setPlantIsChange(){
    window.localStorage.setItem("plantIsChanged","0");
}

function setPlantNotChange(){
    window.localStorage.setItem("plantIsChanged","1");
}

function getPlantChangeStatus(){
    window.localStorage.getItem("plantIsChanged");
}