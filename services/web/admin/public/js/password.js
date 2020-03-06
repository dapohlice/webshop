function checkPassword(first,secound){
    if(first.length < 8)
    {
        return "Password must be at least 8 characters long.";
    }
    
    if(!/\d/.test(first) || !/[a-z]/.test(first) || !/[A-Z]/.test(first))
    {
        return "Password must container at least one upper-, one lowercase character and one number.";
    }
    if(first !== secound)
    {
        return "Passwords do not match.";
    }

    return true;
}
