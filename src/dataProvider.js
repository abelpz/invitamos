import data from "./data.js"

const baseUrl = window.location.origin + window.location.pathname
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const de = urlParams.get('anfitrion')

const normalizeText = str => encodeURIComponent(str.normalize('NFD').replace(/\p{Diacritic}| |\./gu, ''))

//${guests.length > 1 ? 'Les' : 'Te'}

let whatsappMessage = (guest, guests) => `

Hola ${(guest.parentezco != '') ? guest.parentezco.toLowerCase() : guest.nombre}! Te escriben Abel y Valeska, estamos muy emocionados por ${guests.length > 1 ? 'darles' : 'darte'} una muy buena noticia. En el enlace ${guests.length > 1 ? 'les' : 'te'} contamos todo 😊.
`

let emailMessage = (guest, guests) => `

Hola ${(guest.parentezco != '') ? guest.parentezco.toLowerCase() : guest.nombre}! Te escriben Abel y Valeska, estamos muy emocionados por ${guests.length > 1 ? 'darles' : 'darte'} una muy buena noticia. En el enlace ${guests.length > 1 ? 'les' : 'te'} contamos todo 😊.
`

const guestsTable = []

const guestHeads = data.filter(
    (guest) => {
        if (de) {
            return guest["nombre del grupo"] !== '' && (guest.de === de)
        }
        return guest["nombre del grupo"] !== ''
    } 
)

guestHeads.forEach(
    (guest) => {
        let guestsRow = {
            group: guest["nombre del grupo"],
            includes: [],
            inviteLink: `https://abelyvaleska.com/invitacion/${normalizeText(guest["nombre del grupo"])}`,
            whatsapp: [],
            email:[]
        }
        let guestsGroup = data.filter((person) => guest.grupo === person.grupo)
        
        guestsRow.includes = [...guestsGroup.map( (guest) => guest.nombre +' '+guest.apellido )]
        
        guestsRow.whatsapp = [...guestsGroup.map((guest) => ({
            nombre: guest.nombre,
            telefono: guest.telefono,
            parentezco: guest.parentezco,
            anfitrion: guest.de,
            enviado: guest.Enviado != '' ? true : false
        }))]
        
        guestsRow.email = [...guestsGroup.map((guest) => ({
            nombre: guest.nombre,
            email: guest.email,
            parentezco: guest.parentezco,
            anfitrion: guest.de,
            enviado: guest.Enviado != '' ? true : false
        }))]

        guestsTable.push(guestsRow)
    }
)


const fillTable = function (guestsTable) {
    let GuestTable = document.getElementById('tabla');
    guestsTable.forEach(
        (guestsRow) => {
            
            let GroupColumn = document.createElement('div')
            GroupColumn.classList.add('grupo')
            GuestTable.appendChild(GroupColumn)
            
            let MembersColumn = document.createElement('div')
            MembersColumn.classList.add('miembros')
            GuestTable.appendChild(MembersColumn)
            
            let WhatsappColumn = document.createElement('div')
            WhatsappColumn.classList.add('whatsapp')
            GuestTable.appendChild(WhatsappColumn)

            let EmailColumn = document.createElement('div')
            EmailColumn.classList.add('email')
            GuestTable.appendChild(EmailColumn)

            let InviteColumn = document.createElement('div')
            InviteColumn.classList.add('invitacion')
            GuestTable.appendChild(InviteColumn)
            
            GroupColumn.innerHTML = guestsRow.group

            MembersColumn.innerHTML = guestsRow.includes.join()

            InviteColumn.innerHTML = `
                <a target="_blank" href="${guestsRow.inviteLink}">Invitacion</a>
            `
            WhatsappColumn.innerHTML = `
                ${guestsRow.whatsapp.map(
                    (guest) => {
                        if (guest.telefono) return `
                            <a ${guest.enviado ? 'class="disabled"' : ''} target="_blank" href="https://wa.me/${guest.telefono}?text=${encodeURIComponent(guestsRow.inviteLink + ' ' + whatsappMessage(guest,guestsRow.includes))}">Invitar a ${guest.nombre}</a>
                        `
                    }
                )}
            `
            EmailColumn.innerHTML = `
                ${guestsRow.email.map(
                    (guest) => {
                        if (guest.email) return `
                            <a ${guest.enviado ? 'class="disabled"' : ''} target="_blank" href="mailto:${guest.email}?subject=${`Boda Abel y Valeska: ${guestsRow.group}`}&body=${encodeURIComponent(guestsRow.inviteLink + ' ' + emailMessage(guest,guestsRow.includes))}">Invitar a ${guest.nombre}</a>
                        `
                    }
                ).join()}
            `
        }
    )
}

fillTable(guestsTable)

// const guests = [
//     {
//         group: 'flia.',
//         includes: [{invitado}],
//         inviteLink: '',
//         whatsapp: [{nombre,telefono}],
//         email: [{nombre,correo}],
//     },
// ]


