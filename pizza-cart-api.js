document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {

        init(){
            
            axios
                .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                .then((result)=>{
                    
                this.pizzas= result.data.pizzas
          })
          .then(()=>{
            return this.createCart();
          })
          .then((result)=>{
            this.cartId = result.data.cart_code;
          });
        },
        featuredPizzas(){
          
          return axios
              .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
        },
        postfeaturedPizzas(){
          
          return axios
              .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
        },

        createCart(){
          ///api/pizza-cart/create
          return axios
              .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
        },

        showCart(){
          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

          axios
            .get(url)
            .then((result) =>{
              this.cart = result.data;
            });
        },

        pizzaImage(pizza){
          return `./images/${pizza.size}.png`
        },

        message: 'Cart code',
        username:'',
        pizzas: [],
        featuredpizzas: [],
        cartId:'',
        cart: {total : 0},
        paymentMessege:'',
        payNow: false,
        paymentAmount: 0,

        add(pizza){
      
            const params = {
              cart_code : this.cartId,
              pizza_id : pizza.id
            }

            axios
              .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
              .then(()=>{
                this.message= "pizza added to the cart"
                this.showCart();
              })
              .then(()=>{
             
                return this.featuredPizzas();
                
              })
              .then(()=>{
                return this.postfeaturedPizzas();
              })
              .catch(err=>alert(err));
            
        },
        remove(pizza){
          
          const params = {
            cart_code :this.cartId,
            pizza_id :pizza.id
          }

          axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
            .then(()=>{
              this.message= "pizza removed to the cart"
              this.showCart();
            })
            .catch(err=>alert(err));

        },
        pay(pizza){
          const params = {
            cart_code : this.cartId,
          }

          axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
            .then(()=>{
                if(!this.paymentAmount){
                    this.paymentMessege = 'No amount entered!, Please enter amount'
                }
                else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                    this.paymentMessege = 'payment is sucessful!'
                    this.message= this.username  +" paid, the order successfully!"
                    setTimeout(() => {
                        this.cart.total=0
                        window.location.reload()
                    }, 10000);
    
                }else{
                    this.paymentMessege = 'Sorry - You got insufficient balance!'
                    setTimeout(() => {
                        this.cart.total=0
                    }, 6000);
                }
            
            })
            .catch(err=>alert(err));

        }

      }
    });
})