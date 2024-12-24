export class EmailMessageDto {
  static create(link: string, subj: string, queryParam: string, code: string): string {
    return `
      <h1>${subj}</h1>
      <p>To finish, please follow the link below:
          <a href='http://localhost:8000/auth/${link}?${queryParam}=${code}'>${subj}</a>
      </p>
      <b>You have 5 minutes!</b>
    `;
  }
}
