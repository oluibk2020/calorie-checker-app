

class CalorieTracker{
    constructor() {
        this._calorieLimit = 2000
        this._totalCalories = 0
        this._meals = []
        this._workouts = []
        this._displayCaloriesLimit() //display calories limit
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
        this._displayCaloriesProgress()
    }

    addMeal(meal){
        this._meals.push(meal)
        this._totalCalories += meal.calories
        this._displayNewMeal(meal)

        this._render() //update screen
    }
    addWorkout(workout){
        this._workouts.push(workout)
        this._totalCalories -= workout.calories
        this._displayNewWorkout(workout)
        this._render() //update screen
    }
    
    removeWorkout(id){
        //finding the index of an array
        const index = this._workouts.findIndex((workout) => workout.id === id)
        
        //checking the index if true
        if (index !== -1) {
            const workout = this._workouts[index]
            //adding back removed calories
            this._totalCalories += workout.calories
            //removing workout from array
            this._workouts.splice(index, 1)
            this._render()
        }
    }
    removeMeal(id){
        //finding the index of an array
        const index = this._meals.findIndex((meal) => meal.id === id)
        
        //checking the index if true
        if (index !== -1) {
            const meal = this._meals[index]
            //adding back removed calories
            this._totalCalories -= meal.calories
            //removing workout from array
            this._meals.splice(index, 1)
            this._render()
        }
    }

    reset(){
        this._calorieLimit = 0
        this._totalCalories = 0
        this._meals = []
        this._workouts = []
        this._render()
    }

    setLimit(calorielimit){
        this._calorieLimit = calorielimit
        this._displayCaloriesLimit()
        this._render()
    }

    //Private Methods
    //change value of Gain/Loss
    _displayCaloriesTotal(){
        const _totalCaloriesEl = document.querySelector('#calories-total')
        _totalCaloriesEl.textContent = this._totalCalories
    }
    //change value of calories limit
    _displayCaloriesLimit(){
        const _caloriesLimitEl = document.querySelector('#calories-limit')
        _caloriesLimitEl.textContent = this._calorieLimit
    }
    //change value of calories consumed
    _displayCaloriesConsumed(){
        const _caloriesConsumedEl = document.querySelector('#calories-consumed')
        let consumed = 0
          this._meals.forEach(meal => {
            consumed += meal.calories
          });
        _caloriesConsumedEl.textContent = consumed  
    }
    //change value of calories burned
    _displayCaloriesBurned(){
        const _caloriesBurnedEl = document.querySelector('#calories-burned')
        let burned = 0
          this._workouts.forEach(workout => {
            burned += workout.calories
          });

        _caloriesBurnedEl.textContent = burned
    }

    //display calories remaining
    _displayCaloriesRemaining(){
        const caloriesRemainingEl = document.querySelector('#calories-remaining')
        const progressEl = document.querySelector('#calorie-progress')

        const remaining = this._calorieLimit - this._totalCalories

        caloriesRemainingEl.textContent = remaining

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light')
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger')
            progressEl.classList.remove('bg-success')
            progressEl.classList.add('bg-danger')
        } else{
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger')
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light')
            progressEl.classList.remove('bg-danger')
            progressEl.classList.add('bg-success')

        }
    }

    //display progress bar of gain/loss
    _displayCaloriesProgress(){
        const progressEl = document.querySelector('#calorie-progress')
        const percentage = (this._totalCalories / this._calorieLimit) * 100
        const width = Math.min(percentage, 100) //returns the minimum no
        progressEl.style.width = `${width}%`
    }

    //display new meal
    _displayNewMeal(meal){
        const mealsEl  = document.querySelector('#meal-items')
        const mealEl = document.createElement('div')
        mealEl.classList.add('card', 'my-2')
        mealEl.setAttribute('data-id', meal.id)
        mealEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`
      mealsEl.appendChild(mealEl)
    }
    //display new workout
    _displayNewWorkout(workout){
        const workoutsEl = document.querySelector('#workout-items')
        const workoutEl = document.createElement('div')
        workoutEl.classList.add('card', 'my-2')
        workoutEl.setAttribute('data-id', workout.id)
        workoutEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`
      workoutsEl.appendChild(workoutEl)
    }


    //update screen
    _render(){
        this._displayCaloriesProgress()
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
    }

}

class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}


class App {
    constructor() {
        this._tracker = new CalorieTracker()

        document.querySelector('#meal-form').addEventListener('submit', this._newMeal.bind(this))
        document.querySelector('#workout-form').addEventListener('submit', this._newWorkout.bind(this))
        //remove items
        document.querySelector('#meal-items').addEventListener('click', this._removeMealItem.bind(this))
        document.querySelector('#workout-items').addEventListener('click', this._removeWorkoutItem.bind(this))
        //filter items
        document.querySelector('#filter-meals').addEventListener('keyup', this._filterMeals.bind(this))
        document.querySelector('#filter-workouts').addEventListener('keyup', this._filterWorkouts.bind(this))
        document.querySelector('#reset').addEventListener('click', this._reset.bind(this))
        document.querySelector('#limit-form').addEventListener('submit', this._setLimit.bind(this))
    }

    _newWorkout(e){
        e.preventDefault()

        const name = document.querySelector('#workout-name')
        const calories = document.querySelector('#workout-calories')

        //validate input
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields')
            return
        }

        const workout = new Workout(name.value, +calories.value)
        //clear form entry
        name.value = ''
        calories.value = ''

        this._tracker.addWorkout(workout)

        const collapseWorkout = document.querySelector('#collapse-workout')
        const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
            toggle: true
        })

    }
    _newMeal(e){
        e.preventDefault()

        const name = document.querySelector('#meal-name')
        const calories = document.querySelector('#meal-calories')

        //validate input
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields')
            return
        }

        const meal = new Meal(name.value, +calories.value)
        //clear form entry
        name.value = ''
        calories.value = ''

        this._tracker.addMeal(meal)

        const collapseMeal = document.querySelector('#collapse-meal')
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        })

    }

    _removeMealItem(e){
        e.preventDefault()
        if (e.target.parentElement.classList.contains('delete')) {
            if (confirm('Are you sure? ')) {
                //get id
                const id = e.target.closest('.card').getAttribute('data-id')

                //remove id from tracker
                this._tracker.removeMeal(id)
                //remove meal from meal lists
                 e.target.parentElement.parentElement.parentElement.parentElement.remove()
            }
        }
    }
    _removeWorkoutItem(e){
        e.preventDefault()
        if (e.target.parentElement.classList.contains('delete')) {
            if (confirm('Are you sure?')) {
               const id = e.target.closest('.card').getAttribute('data-id')

               this._tracker.removeWorkout(id)
                e.target.parentElement.parentElement.parentElement.parentElement.remove()
            }
        }
    }
    _filterMeals(e){
        e.preventDefault()
        const items = document.querySelectorAll("#meal-items .card"); //getting the lists
        const text = e.target.value.toLowerCase(); //getting the userinput and converting to small letters


        for (const meal of items) {
            const mealName = meal.firstElementChild.firstElementChild.textContent.toLowerCase() // getting the name from the DOM

            if (mealName.includes(text)) {
                //displaying meal
                meal.style.display = 'block'
            }else{
                //hiding meal
                meal.style.display = 'none'

            }
            
        }
    }
    _filterWorkouts(e){
        e.preventDefault()
        const items = document.querySelectorAll("#workout-items .card"); //getting the lists
        const text = e.target.value.toLowerCase(); //getting the userinput and converting to small letters


        for (const workout of items) {
            const workoutName = workout.firstElementChild.firstElementChild.textContent.toLowerCase() // getting the name from the DOM

            if (workoutName.includes(text)) {
                //displaying meal
                workout.style.display = 'block'
            }else{
                //hiding meal
                workout.style.display = 'none'

            }
            
        }
    }

    _setLimit(e){
        e.preventDefault()

        const limit = document.querySelector('#limit')

        if (limit.value === '') {
            alert('Please add a limit')
            return
        }

        this._tracker.setLimit(+limit.value)
        limit.value= ''

        const modalEl = document.querySelector('#limit-modal')
        const modal = bootstrap.Modal.getInstance(modalEl)
        modal.hide()
    }


    _reset(){
        this._tracker.reset()
        document.querySelector('#meal-items').innerHTML = ''
        document.querySelector('#workout-items').innerHTML = ''
        document.querySelector('#filter-meals').value = 0
        document.querySelector('#filter-workouts').value = 0

    }
    
}

const runApp = new App()

localStorage.setItem('name', 'Brad')
console.log(localStorage.getItem('name'));
// localStorage.removeItem('name')
localStorage.clear()