import fetch from "node-fetch"


async function getSignificado() {
    const dados = await fetch("https://significado.herokuapp.com/palavra")
    console.log(await dados.json())
}
getSignificado()