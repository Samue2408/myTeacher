export interface BookingsType {
    "_id": string,
    "studentId": string,
    "tutorId": string,
    "subjectId": string,
    "type": string,
    "status": string,
    "date": Date,
    "startTime": string,
    "endTime": string,
    "videoCallLink": string,
    "price": number
}