const axios = require('axios')


const main = async () => {
    const instance = axios.create()

    const response = await instance.get("https://circleci.com/api/v1.1/projects/", {
        headers: {
            Accept: "application/json",
            "Circle-Token": "dummy"
        }
    })

    console.log(response.data)
}

main()
