export const formatDate = (inputDate: Date) => {
    const date = new Date(inputDate).toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', weekday:"long", hour: '2-digit', hour12: false, minute:'2-digit', second:'2-digit'})
  
    return date;
  }
  