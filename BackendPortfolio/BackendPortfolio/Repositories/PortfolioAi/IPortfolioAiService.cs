/*using BackendPortfolio.DTO.Portfolio;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories.PortfolioAi
{
    public interface IPortfolioAiService
    {
       
            Task<ChatResponseDto> ChatAsync(ChatRequestDto request);
            Task<string> GeneratePortfolioHtmlAsync(int collaboratorId, DbVitrineContext db);
            Task<string> UpdatePortfolioSectionAsync(string currentHtml, string sectionId, string newData);

        Task<string> GetProfileHashAsync(int collaboratorId, DbVitrineContext db);
        Task<string> PatchPortfolioFromProfileAsync(int collaboratorId, DbVitrineContext db); // ← ajouter
    
        //pour update data db 

        Task<ChatCorrectResponseDto> CorrectAndUpdateAsync(ChatCorrectRequestDto request, DbVitrineContext db);
    }
}*/
