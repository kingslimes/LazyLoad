class Lazy {
    /**
     * @param { string } HTMLElementID Document ID
     **/
    constructor( HTMLElementID ) {
        
        const RootElement = document.getElementById( HTMLElementID );
        
        function loadImage( link ) {
            return new Promise( ( success, error ) => {
                const img = new Image();
                img.src = link;
                
                important( img.style, {
                    "width": "100%",
                    "display": "block"
                })
                
                img.onload = function( evt ) {
                    success( img )
                };
                img.onerror = function( err ) {
                    error( err )
                };
                
            })
        }
        
        function important( elm, style ) {
            Object.keys( style ).forEach( key => {
                elm.setProperty( key, style[key], "important" )
            })
        }
        
        async function initialImage( list ) {
            for ( let x = 0; x < list.length; x++ ) {
                await loadImage( list[x] ).then( img => {
                    const loading = RootElement.querySelector(`div[data-id="${x}"]`);
                    
                    RootElement.replaceChild( img, loading );
                }).catch( err => {
                    const loading = RootElement.querySelector(`div[data-id="${x}"]`);
                    loading.innerText = "Image Error"
                })
                
            }
        }
        
        
        /**
         * @param { [] } images Array image url list
         * @return { Lazy }
         **/
        function render( images ) {
            this.length = images.length;
            this.state = "render";
            for ( let i=0; i < images.length; i++ ) {
                const div = document.createElement("div");
                
                important( div.style, {
                    "width": "100%",
                    "height": "100px",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "15pt"
                })
                
                div.setAttribute("data-id", i);
                div.innerText = "Loading...";
                RootElement.appendChild( div )
            }
            document.addEventListener("readystatechange", ev => {
                ( ev.target.readyState === "complete" ) && initialImage( images );
            })
            return this
        }
        
        this.render = render.bind( this );
        
        function Lazyload( src ) {
            const observer = new IntersectionObserver( entries => {
                entries.forEach( entry => {
                    if ( entry.isIntersecting ) {
                        entry.target.src = src;
                        
                        observer.unobserve( entry.target );
                    }
                });
            });
            return observer
        }
        /**
         * @param { string } name Data attribute Eample data-{ name }
         * @return { Lazy }
         **/
        function lazy( name ) {
            const images = RootElement.querySelectorAll("img");
            this.length = images.length;
            this.state = "lazy";
            
            document.addEventListener("readystatechange", ev => {
                if ( ev.target.readyState === "complete" ) {
                    images.forEach( img => {
                        const source = img.dataset[name];
                        important( img.style, {
                            width: "100%",
                            display: "block"
                        })
                        source && Lazyload( source ).observe( img );
                        source && img.removeAttribute(`data-${name}`);
                    });
                };
            })
            
            return this
        }
        
        this.lazy = lazy.bind( this );
    }
    
}
