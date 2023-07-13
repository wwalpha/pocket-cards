//
//  ChoiceButtonView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ChoiceButton: View {
    var text: String
    var index: String
    var isError: Bool = false
    var frameHeight: CGFloat = 0
    var fontSize: CGFloat = 32

    let onDetail: () -> Void

    init(text: String, index: String, isError: Bool, onDetail: @escaping () -> Void) {
        self.init(text: text, index: index, isError: isError, fontSize: 32, frameHeight: 64, onDetail: onDetail)
    }

    init(text: String, index: String, isError: Bool, fontSize: CGFloat, frameHeight: CGFloat, onDetail: @escaping () -> Void) {
        self.text = text
        self.index = index
        self.isError = isError
        self.frameHeight = frameHeight
        self.onDetail = onDetail
        self.fontSize = fontSize
    }

    var body: some View {
        HStack {
            Button(action: onDetail) {
                HStack {
                    Text(self.index)
                        .frame(width: 64, height: frameHeight, alignment: .center)
                        .font(.system(size: fontSize, design: .default))
                        .background(Color.purple)
                        .foregroundColor(Color.white)
                    Text(self.text)
                        .frame(maxWidth: .infinity, maxHeight: 32, alignment: .leading)
                        .padding(.leading, 16)
                        .font(.system(size: fontSize, design: .default))
                        .foregroundColor(Color.black)
//                        .foregroundColor(Color.gray.opacity(0.8))
                        .contentShape(Rectangle())
                }.border(isError ? Color.error : Color.purple, width: 2)
            }
        }
    }
}

struct ChoiceButtonView_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceButton(text: "12345", index: "1", isError: true) {
            print(111)
        }
    }
}
