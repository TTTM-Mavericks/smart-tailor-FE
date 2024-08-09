const getCurrentDateTime = (): any => {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 19).replace("T", " ");
};

export const __isNearCurrentDate = (expectedDate: any): boolean => {
    const currentDate = new Date();
    const completionDate = new Date(expectedDate.replace(" ", "T")); // Convert to a valid Date format

    // Calculate the difference in milliseconds
    const timeDifference = completionDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference >= 0 && daysDifference <= 1; // Within 1 day
};

// Example of how to get the current date and time on the user's device

export const __handleGetDateTimeColor = (inputDate: any): string => {
    const currentDate = new Date();
    const inputDateTime = new Date(inputDate.replace(" ", "T"));
  
    // Calculate the difference in milliseconds
    const timeDifference = inputDateTime.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
  
    // Return color based on the comparison
    if (daysDifference < 0) {
      return "text-red-500"; // Past date or time
    } else if (daysDifference <= 1) {
      return "text-yellow-500"; // Near or same date (within 1 day)
    } else {
      return "text-gray-500"; // Future date (more than 1 day away)
    }
  };
  