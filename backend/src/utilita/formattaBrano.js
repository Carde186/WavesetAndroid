// Forma JSON di un brano condivisa da /brani e /ricerca: la riga SQL deve
// contenere le colonne con gli alias usati qui (artista_*, album_*).
function formattaBrano(brano) {
    return {
        id: brano.id,
        titolo: brano.titolo,
        dataPubblicazione: brano.data_pubblicazione,
        urlSpotify: brano.url_spotify,
        artista: {
            id: brano.artista_id,
            nome: brano.artista_nome,
            immagineUrl: brano.artista_immagine_url,
        },
        album: brano.album_id
            ? {
                  id: brano.album_id,
                  titolo: brano.album_titolo,
                  copertinaUrl: brano.album_copertina_url,
              }
            : null,
    };
}

module.exports = formattaBrano;
