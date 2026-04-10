using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ExceptionDb
{
    public int Id { get; set; }

    public string? Message { get; set; }

    public string? Stacktrace { get; set; }

    public string? Data { get; set; }

    public string? Hresult { get; set; }

    public string? FunctionName { get; set; }

    public string? InPlaintext { get; set; }

    public string? Repository { get; set; }

    public DateTime? CreateDate { get; set; }
}
