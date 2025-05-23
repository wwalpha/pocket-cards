//
//  ChoiceButton.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ChoiceButton: View {
    @State private var isButtonDisabled = false

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
            Button {
                // エラーの場合、初回表示より5秒経過していない場合は、反応しない
//                if Date.now.timeIntervalSince(initDate) < 2, isError == true {
//                    return
//                }

                onDetail()
            } label: {
                HStack {
                    Text(index)
                        .frame(width: 64, height: frameHeight, alignment: .center)
                        .font(.system(size: fontSize, design: .default))
                        .background(Color.purple)
                        .foregroundColor(Color.white)
                    Text(text)
                        .frame(maxWidth: .infinity, maxHeight: frameHeight, alignment: .leading)
                        .padding(.leading, 16)
                        .font(.system(size: fontSize, design: .default))
                        .foregroundColor(isError ? Color.white : Color.black)
                        .contentShape(Rectangle())
                }.border(Color.purple, width: 2)
            }
            .background(isError ? Color.language : Color.white)

//            Button(action: onDetail) {
//                HStack {
//                    Text(index)
//                        .frame(width: 64, height: frameHeight, alignment: .center)
//                        .font(.system(size: fontSize, design: .default))
//                        .background(Color.purple)
//                        .foregroundColor(Color.white)
//                    Text(text)
//                        .frame(maxWidth: .infinity, maxHeight: frameHeight, alignment: .leading)
//                        .padding(.leading, 16)
//                        .font(.system(size: fontSize, design: .default))
//                        .foregroundColor(isError ? Color.white : Color.black)
//                        .contentShape(Rectangle())
//                }.border(Color.purple, width: 2)
//            }.background(isError ? Color.language : Color.white)
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
