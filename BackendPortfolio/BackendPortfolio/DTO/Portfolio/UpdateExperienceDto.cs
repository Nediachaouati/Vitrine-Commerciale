/*namespace BackendPortfolio.DTO.Portfolio
{
    public class UpdateExperienceDto
    {
            public int ExperienceId { get; set; }
            public string? CompanyName { get; set; }
            public string? JobTitle { get; set; }
            public string? Description { get; set; }
            public string? Location { get; set; }
            public string? Technologies { get; set; }
            public DateOnly? StartDate { get; set; }
            public DateOnly? EndDate { get; set; }
            public bool? IsCurrent { get; set; }
        }

        public class ChatCorrectRequestDto
        {
            public int CollaboratorId { get; set; }
            public string CorrectionMessage { get; set; } = string.Empty;
            public List<ChatMessageDto> Messages { get; set; } = new();
        }

        public class ChatCorrectResponseDto
        {
            public string Message { get; set; } = string.Empty;
            public string? EntityType { get; set; }   // "experience"|"skill"|"certification"
            public string? Action { get; set; }        // "update"|"delete"|"add"
            public object? UpdatedData { get; set; }
            public string UpdatedHtml { get; set; } = string.Empty;
        }
    }*/


