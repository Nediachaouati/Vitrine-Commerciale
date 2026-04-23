/*namespace BackendPortfolio.DTO.Portfolio
{
    public class AiChatMessageDto
    {
        public string Role { get; set; } = "user"; // "user" | "assistant"
        public string Content { get; set; } = string.Empty;
    }

    public class AiChatRequestDto
    {
        public int PortfolioId { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<AiChatMessageDto> History { get; set; } = new();
    }

    public class AiChatResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public List<AiActionDto> Actions { get; set; } = new();
    }

    public class AiActionDto
    {
        public string Type { get; set; } = string.Empty;
        // "show_experience" | "hide_experience" | "show_skill" | "hide_skill" | ...
        public int EntityId { get; set; }
        public string? Description { get; set; }
    }
}
*/