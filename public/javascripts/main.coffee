$ ->

  selectController = ()->
    if window.getSelection && document.createRange
      saveSelection = (containerEl)->
        range = window.getSelection().getRangeAt 0
        preSelectionRange = range.cloneRange()
        preSelectionRange.selectNodeContents containerEl
        preSelectionRange.setEnd range.startContainer, range.startOffset
        start = preSelectionRange.toString().length
        console.log preSelectionRange
        return {
          start: start,
          end: start + range.toString().length
        }

      restoreSelection = (containerEl, savedSel)->
        charIndex = 0
        range = document.createRange()
        range.collapse true
        nodeStack = [containerEl] 
        foundStart = false
        stop = false

        while !stop && (node = nodeStack.pop())
          if node.nodeType is 3
            nextCharIndex = charIndex + node.length
            if !foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex
              range.setStart node, savedSel.start - charIndex
              foundStart = true
            if foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex
              range.setEnd node, savedSel.end - charIndex
              stop = true
            charIndex = nextCharIndex

          else
            i = node.childNodes.length
            while i--
              nodeStack.push node.childNodes[i]

        sel = window.getSelection()
        console.log sel
        sel.removeAllRanges()
        sel.addRange(range)

    else if document.selection
      saveSelection = (containerEl)->
        selectedTextRange = document.selection.createRange()
        preSelectionTextRange = document.body.createTextRange()
        preSelectionTextRange.moveToElementText containerEl
        preSelectionTextRange.setEndPoint "EndToStart", selectedTextRange
        start = preSelectionTextRange.text.length

        return {
          start: start,
          end: start + selectedTextRange.text.length
        }

      restoreSelection = (containerEl, savedSel)->
        textRange = document.body.createTextRange()
        textRange.moveToElementText containerEl
        textRange.collapse true
        textRange.moveEnd "character", savedSel.end
        textRange.moveStart "character", savedSel.start
        textRange.select();
    
    return {
      saveSelection: saveSelection
      restoreSelection: restoreSelection
    }


  renderComments = (comments)->
    jade.render $("#comment-col")[0], "commentViewBox", {comments: comments}

    $comments = $(".user-comment")
    # $(comment).find(".comment-text").hide() for comment in $comments


  Comment = (data)->
    this.user = data.user
    this.range = data.range
    this.commentText = data.commentText
    timestamp = new Date()
    this.timestamp = timestamp.toDateString() + " " + timestamp.toLocaleTimeString()
    return this

  currentUserSelection = {}
  commentMark = {}
  userComments = []

  selectControl = selectController()

  $("#airlock").on "mouseup", (e)->
    if !$(e.target).hasClass("glyphicon-edit")
      $("#comment-btn-container").remove()

    if $("#comment-btn-container").length is 0
      selected = window.getSelection()

      if !selected.isCollapsed && selected.rangeCount is 1 && selected.toString().length isnt 0
        
        #Save Selection
        userSel = selectControl.saveSelection(e.originalEvent.target)
        console.log userSel
        userSel.containerEl = e.originalEvent.target
        userSel.originalText = selected.toString()

        currentUserSelection = userSel
        #

        #Render Comment Button
        $(this).append("<div id='comment-btn-container'></div>")
        
        font = parseInt($(this).css("font-size"))
        top = e.pageY-(font*3)
        left = e.pageX

        jade.render $("#comment-btn-container")[0], "commentButton"
        $(".comment-btn").offset {top: top, left: left}
        #

        console.log selected.toString(), selected.getRangeAt(0)

  console.log "done"

  $("#airlock").on "click", "#comment-btn-container", (e)->
    e.stopPropagation()
    jade.render $("#comment-col")[0], "commentEntryBox"

    selectControl.restoreSelection currentUserSelection.containerEl, currentUserSelection

    $(this).remove()

    return false

  $("#comment-col").on "click", "#submit-comment", (e)->
    userEntry = {}
    userEntry.commentText = $(this).closest(".user-comment").find(".form-control").val()
    userEntry.user = "Test User"
    userEntry.range = currentUserSelection

    userComments.push new Comment(userEntry)
    console.log userComments[0]

    renderComments(userComments)

  $("#comment-col").on "click", "#cancel-comment", (e)->
    renderComments(userComments)

  $("#show-comment").on "click", ()->
    for comment in userComments
      selectControl.restoreSelection comment.range.containerEl, comment.range

  $("#comment-col").on "mouseenter", ".user-comment", (e)->
    if $(this).parent().attr("id") isnt "comment-form"
      $(this).addClass("highlight-box")
      id = +$(this).attr("data-id")

      selectControl.restoreSelection userComments[id].range.containerEl, userComments[id].range

  $("#comment-col").on "mouseleave", ".user-comment", (e)->
    if $(this).parent().attr("id") isnt "comment-form"
      $(this).removeClass("highlight-box")

      window.getSelection().removeAllRanges()

  $("#comment-col").on "click", ".user-comment", (e)->
    # $(this).find(".comment-text").slideToggle()
    # $(comment).find(".comment-text").slideUp() for comment in $(this).parent().siblings()

    id = +$(this).attr("data-id")
    selectControl.restoreSelection userComments[id].range.containerEl, userComments[id].range









